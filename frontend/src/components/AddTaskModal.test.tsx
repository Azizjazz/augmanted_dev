import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import { Task } from '@/lib/types';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

const mockTasks: Task[] = [];

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  );
}

describe('Add Task Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('opens modal when Add Task button is clicked', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    render(<KanbanBoard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('+ Add Task')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('+ Add Task');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  it.skip('creates task and shows it in the DOM via optimistic update', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    const apiResponse = {
      id: 'new-task-id',
      title: 'New Test Task',
      description: '',
      priority: 'medium',
      column_id: 'col-1',
      order: 0,
      created_at: '2026-03-16T10:00:00Z',
      updated_at: '2026-03-16T10:00:00Z',
    };

    let callCount = 0;
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/tasks' || url === 'http://localhost:8000/api/tasks') {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve({
            ok: true,
            json: async () => [],
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => [apiResponse],
        });
      }
      if (url.includes('/api/tasks')) {
        return Promise.resolve({
          ok: true,
          json: async () => apiResponse,
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<KanbanBoard />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('TaskBoard Pro')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add Task');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'New Test Task' } });

    const submitButton = screen.getByText('Create Task');
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('closes modal when cancel is clicked', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    render(<KanbanBoard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('+ Add Task')).toBeInTheDocument();
    });
    
    const addButton = screen.getByText('+ Add Task');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    });
  });
});
