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


class TestAuthentication:
    """Security tests for authentication"""

    def test_cannot_access_tasks_without_token(self):
        response = client.get("/tasks")
        assert response.status_code == 401

    def test_cannot_create_task_without_token(self):
        response = client.post(
            "/tasks",
            json={"title": "Test Task", "priority": "medium", "column_id": "col-1"},
        )
        assert response.status_code == 401

    def test_cannot_delete_task_without_token(self):
        response = client.delete("/tasks/some-id")
        assert response.status_code == 401


class TestUserTaskIsolation:
    """Tests for user task ownership"""

    def test_user_can_only_see_own_tasks(self):
        client.post(
            "/api/auth/register",
            json={"email": "user1@test.com", "password": "pass123"},
        )
        login1 = client.post(
            "/api/auth/login", json={"email": "user1@test.com", "password": "pass123"}
        )
        token1 = login1.json()["access_token"]
        client.post(
            "/tasks",
            json={"title": "User 1 Task", "priority": "high", "column_id": "col-1"},
            headers={"Authorization": f"Bearer {token1}"},
        )

        client.post(
            "/api/auth/register",
            json={"email": "user2@test.com", "password": "pass123"},
        )
        login2 = client.post(
            "/api/auth/login", json={"email": "user2@test.com", "password": "pass123"}
        )
        token2 = login2.json()["access_token"]

        tasks_resp = client.get("/tasks", headers={"Authorization": f"Bearer {token2}"})
        assert len(tasks_resp.json()) == 0

    def test_user_cannot_delete_others_task(self):
        client.post(
            "/api/auth/register",
            json={"email": "user1@test.com", "password": "pass123"},
        )
        login1 = client.post(
            "/api/auth/login", json={"email": "user1@test.com", "password": "pass123"}
        )
        token1 = login1.json()["access_token"]
        create_resp = client.post(
            "/tasks",
            json={"title": "User 1 Task", "priority": "high", "column_id": "col-1"},
            headers={"Authorization": f"Bearer {token1}"},
        )
        task_id = create_resp.json()["id"]

        client.post(
            "/api/auth/register",
            json={"email": "user2@test.com", "password": "pass123"},
        )
        login2 = client.post(
            "/api/auth/login", json={"email": "user2@test.com", "password": "pass123"}
        )
        token2 = login2.json()["access_token"]

        delete_resp = client.delete(
            f"/tasks/{task_id}", headers={"Authorization": f"Bearer {token2}"}
        )
        assert delete_resp.status_code == 404


class TestPersistence:
    """Tests for SQLite persistence"""

    def test_data_persists_after_new_token(self):
        client.post(
            "/api/auth/register", json={"email": "test@test.com", "password": "pass123"}
        )
        login1 = client.post(
            "/api/auth/login", json={"email": "test@test.com", "password": "pass123"}
        )
        token1 = login1.json()["access_token"]
        client.post(
            "/tasks",
            json={
                "title": "Persistent Task",
                "priority": "medium",
                "column_id": "col-1",
            },
            headers={"Authorization": f"Bearer {token1}"},
        )

        login2 = client.post(
            "/api/auth/login", json={"email": "test@test.com", "password": "pass123"}
        )
        token2 = login2.json()["access_token"]

        tasks_resp = client.get("/tasks", headers={"Authorization": f"Bearer {token2}"})
        assert len(tasks_resp.json()) == 1
        assert tasks_resp.json()[0]["title"] == "Persistent Task"
