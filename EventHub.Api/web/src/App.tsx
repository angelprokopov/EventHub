import {Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import NotFound from './pages/NotFound'
import PublicOnly from './components/PublicOnly'
import Protected from './components/Protected'
import Login from './pages/Login'
import Register from './pages/Register'
import MyEvents from './pages/MyEvents'
import Create from './pages/Create'
import Edit from './pages/Edit'
import Details from "./pages/Details.tsx";

export default function App() {
    return (
        <section className="page">
            <div className="app">
                <Header />
                <main className="container">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Catalog />} />
                        <Route path="/events/:eventId" element={<Details />} />

                        {/* Protected routes (need login) */}
                        <Route element={<Protected/>}>
                            <Route path="/events/create" element={<Create />} />
                            <Route path="/events/:eventId/edit" element={<Edit />} />
                            <Route path="/my-events" element={<MyEvents />} />
                        </Route>

                        {/* Auth pages – only for guests */}
                        <Route
                            path="/login"
                            element={
                                <PublicOnly>
                                    <Login />
                                </PublicOnly>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicOnly>
                                    <Register />
                                </PublicOnly>
                            }
                        />

                        {/* 404 fallback */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                </main>
            </div>
        </section>

    )
}