import sys
import os

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

import pytest
from fastapi.testclient import TestClient
from app.main import app
import app.database as db

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_db():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    cursor.execute("DELETE FROM users")
    conn.commit()
    conn.close()
    yield
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    cursor.execute("DELETE FROM users")
    conn.commit()
    conn.close()


def get_auth_token(email="test@test.com", password="pass123"):
    client.post("/api/auth/register", json={"email": email, "password": password})
    login_resp = client.post(
        "/api/auth/login", json={"email": email, "password": password}
    )
    return login_resp.json()["access_token"]


class TestDragToDone:
    """Tests for dragging tasks between columns"""

    def test_drag_to_done(self):
        token = get_auth_token()
        create_resp = client.post(
            "/tasks",
            json={
                "title": "Complete project",
                "priority": "high",
                "column_id": "col-1",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        task_id = create_resp.json()["id"]

        reorder_resp = client.patch(
            f"/tasks/{task_id}/reorder",
            json={"new_column_id": "col-4", "new_order": 0},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert reorder_resp.status_code == 200
        assert reorder_resp.json()["column_id"] == "col-4"
