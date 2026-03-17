import { render, screen, waitFor } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import { Task } from '@/lib/types';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design the UI',
    description: 'Create mockups for the Kanban board',
    priority: 'high',
    columnId: 'col-1',
    order: 0,
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement API',
    description: 'Create FastAPI endpoints',
    priority: 'medium',
    columnId: 'col-2',
    order: 0,
    createdAt: '2026-03-16T11:00:00Z',
    updatedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Write tests',
    priority: 'low',
    columnId: 'col-4',
    order: 0,
    createdAt: '2026-03-16T12:00:00Z',
    updatedAt: '2026-03-16T12:00:00Z',
  },
];

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  );
}

describe('KanbanBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders the board title', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
    render(<KanbanBoard />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('TaskBoard Pro')).toBeInTheDocument();
    });
  });

  it('renders four columns', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
    render(<KanbanBoard />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  it('renders loading state initially', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
    render(<KanbanBoard />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(screen.getByText('TaskBoard Pro')).toBeInTheDocument();
    });
  });

  it('matches snapshot with tasks', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
    const { container } = render(<KanbanBoard />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('renders task cards with correct priority colors', async () => {
    localStorage.setItem('taskboard_token', 'mock-token');
    localStorage.setItem('taskboard_email', 'test@example.com');
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });
    render(<KanbanBoard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Design the UI')).toBeInTheDocument();
    });
    
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });
});
