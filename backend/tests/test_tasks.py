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


def get_auth_token():
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123"},
    )
    login_resp = client.post(
        "/api/auth/login", json={"email": "test@example.com", "password": "password123"}
    )
    return login_resp.json()["access_token"]


class TestTaskCRUD:
    """Test task CRUD operations with authentication"""

    def test_get_tasks_empty(self):
        token = get_auth_token()
        response = client.get(
            "/api/tasks", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_task(self):
        token = get_auth_token()
        payload = {
            "title": "Test Task",
            "description": "Test Description",
            "priority": "high",
            "column_id": "col-1",
        }
        response = client.post(
            "/api/tasks", json=payload, headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["description"] == "Test Description"
        assert data["priority"] == "high"
        assert data["column_id"] == "col-1"
        assert "id" in data
        assert "created_at" in data

    def test_get_task_by_id(self):
        token = get_auth_token()
        create_payload = {
            "title": "Get Test Task",
            "priority": "medium",
            "column_id": "col-2",
        }
        create_response = client.post(
            "/api/tasks",
            json=create_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        task_id = create_response.json()["id"]

        response = client.get(
            f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Get Test Task"
        assert data["id"] == task_id

    def test_get_task_not_found(self):
        token = get_auth_token()
        response = client.get(
            "/api/tasks/nonexistent-id", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 404

    def test_update_task(self):
        token = get_auth_token()
        create_payload = {
            "title": "Original Title",
            "priority": "low",
            "column_id": "col-1",
        }
        create_response = client.post(
            "/api/tasks",
            json=create_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        task_id = create_response.json()["id"]

        update_payload = {"title": "Updated Title", "priority": "high"}
        response = client.patch(
            f"/api/tasks/{task_id}",
            json=update_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["priority"] == "high"

    def test_delete_task(self):
        token = get_auth_token()
        create_payload = {
            "title": "Task to Delete",
            "priority": "low",
            "column_id": "col-1",
        }
        create_response = client.post(
            "/api/tasks",
            json=create_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        task_id = create_response.json()["id"]

        response = client.delete(
            f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 204

        get_response = client.get(
            f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"}
        )
        assert get_response.status_code == 404

    def test_move_task(self):
        token = get_auth_token()
        create_payload = {
            "title": "Task to Move",
            "priority": "medium",
            "column_id": "col-1",
        }
        create_response = client.post(
            "/api/tasks",
            json=create_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        task_id = create_response.json()["id"]

        move_payload = {"column_id": "col-3", "order_index": 0}
        response = client.patch(
            f"/api/tasks/{task_id}/move",
            json=move_payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["column_id"] == "col-3"
        assert data["order"] == 0
