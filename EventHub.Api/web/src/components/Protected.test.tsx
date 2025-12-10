import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Protected from './Protected';

// --------------
// Mock useAuth
// --------------
let mockUser: any = null;

vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        token: mockUser ? 'fake-token' : null,
    }),
}));

function renderWithRouter(initialPath = '/private') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/login" element={<div>Login page</div>} />
                <Route element={<Protected />}>
                    <Route path="/private" element={<div>Private area</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

describe('<Protected />', () => {
    beforeEach(() => {
        mockUser = null; // default: guest
    });

    test('redirects guest to login', () => {
        // guest (mockUser = null)
        renderWithRouter('/private');

        expect(screen.getByText(/Login page/i)).toBeInTheDocument();
        expect(screen.queryByText(/Private area/i)).not.toBeInTheDocument();
    });

    test('renders protected content for logged-in user', () => {
        // logged-in user
        mockUser = {
            id: 'user-1',
            displayName: 'Test User',
            email: 'test@example.com',
        };

        renderWithRouter('/private');

        expect(screen.getByText(/Private area/i)).toBeInTheDocument();
        expect(screen.queryByText(/Login page/i)).not.toBeInTheDocument();
    });
});
