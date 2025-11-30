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
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Catalog/>}/>
                        <Route path="/me/events" element={<Protected><MyEvents /></Protected>} />
                        <Route path="/events/create" element={<Protected><Create /></Protected>} />
                        <Route path="/events/:eventId" element={<Protected><Details/></Protected>}/>
                        <Route path="/events xs/:eventId/edit" element={<Protected><Edit /></Protected>} />

                        <Route path="/login" element={<PublicOnly><Login/></PublicOnly>}/>
                        <Route path="/register" element={<PublicOnly><Register/></PublicOnly>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </main>
            </div>
        </section>

    )
}