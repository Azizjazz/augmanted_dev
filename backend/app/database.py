import os
import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "taskboard.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            priority VARCHAR(20) NOT NULL DEFAULT 'medium',
            column_id VARCHAR(50) NOT NULL,
            task_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def row_to_dict(row) -> Dict[str, Any]:
    if row is None:
        return None
    return dict(row)


def get_all_tasks(user_id: int) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM tasks WHERE user_id = ? ORDER BY column_id, task_order",
        (user_id,),
    )
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(row) for row in rows]


def get_task_by_id(task_id: str, user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id)
    )
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def create_task(task_data: Dict[str, Any], user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO tasks (id, user_id, title, description, priority, column_id, task_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        (
            task_data["id"],
            user_id,
            task_data["title"],
            task_data["description"],
            task_data["priority"],
            task_data["column_id"],
            task_data["order"],
            task_data["created_at"],
            task_data["updated_at"],
        ),
    )
    conn.commit()
    conn.close()
    return task_data


def update_task(
    task_id: str, user_id: int, task_data: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    set_clauses = []
    values = []
    for key, value in task_data.items():
        if value is not None:
            db_key = "task_order" if key == "order" else key
            set_clauses.append(f"{db_key} = ?")
            values.append(value)

    if not set_clauses:
        conn.close()
        return None

    values.extend([task_id, user_id])
    cursor.execute(
        f"UPDATE tasks SET {', '.join(set_clauses)} WHERE id = ? AND user_id = ?",
        values,
    )
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        return None

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def delete_task(task_id: str, user_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def create_user(email: str, hashed_password: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO users (email, hashed_password)
            VALUES (?, ?)
        """,
            (email, hashed_password),
        )
        user_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        return row_to_dict(row)
    except sqlite3.IntegrityError:
        conn.rollback()
        return None
    finally:
        conn.close()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def get_task_stats(user_id: int) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM tasks WHERE user_id = ?", (user_id,))
    total = cursor.fetchone()["total"]

    cursor.execute(
        """
        SELECT column_id, COUNT(*) as count
        FROM tasks WHERE user_id = ?
        GROUP BY column_id
    """,
        (user_id,),
    )
    status_counts = {row["column_id"]: row["count"] for row in cursor.fetchall()}

    cursor.execute(
        """
        SELECT column_id, priority, COUNT(*) as count
        FROM tasks WHERE user_id = ?
        GROUP BY column_id, priority
    """,
        (user_id,),
    )
    priority_per_status = {}
    for row in cursor.fetchall():
        col = row["column_id"]
        if col not in priority_per_status:
            priority_per_status[col] = {"high": 0, "medium": 0, "low": 0}
        priority_per_status[col][row["priority"]] = row["count"]

    conn.close()

    col_id_to_status = {
        "col-1": "backlog",
        "col-2": "in_progress",
        "col-3": "review",
        "col-4": "done",
    }

    mapped_status = {
        col_id_to_status.get(k, "backlog"): v for k, v in status_counts.items()
    }

    mapped_priority = {}
    for col, priorities in priority_per_status.items():
        mapped_col = col_id_to_status.get(col, "backlog")
        mapped_priority[mapped_col] = priorities

    return {
        "total": total,
        "by_status": {
            "backlog": mapped_status.get("backlog", 0),
            "in_progress": mapped_status.get("in_progress", 0),
            "review": mapped_status.get("review", 0),
            "done": mapped_status.get("done", 0),
        },
        "by_priority_per_status": {
            "backlog": mapped_priority.get(
                "backlog", {"high": 0, "medium": 0, "low": 0}
            ),
            "in_progress": mapped_priority.get(
                "in_progress", {"high": 0, "medium": 0, "low": 0}
            ),
            "review": mapped_priority.get("review", {"high": 0, "medium": 0, "low": 0}),
            "done": mapped_priority.get("done", {"high": 0, "medium": 0, "low": 0}),
        },
    }


init_db()
