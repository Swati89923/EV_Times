import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { NewsCardSkeletonGrid } from "./components/Skeleton/Skeleton";

// Route-level code splitting: each page ships as its own chunk instead of
// one ~480KB bundle for the whole app. Home stays eager since it's the
// landing page almost everyone hits first.
import Home from "./pages/Home/Home";
const CategoryPage = lazy(() => import("./pages/CategoryPage/CategoryPage"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const CreateNews = lazy(() => import("./pages/CreateNews/CreateNews"));
const ManageNews = lazy(() => import("./pages/ManageNews/ManageNews"));
const EditNews = lazy(() => import("./pages/EditNews"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Notifications = lazy(() => import("./pages/Notifications/Notifications"));
const SearchResults = lazy(() => import("./pages/SearchResults/SearchResults"));

const RouteFallback = () => (
  <div className="container" style={{ paddingTop: "var(--sp-7)" }}>
    <NewsCardSkeletonGrid count={6} />
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/edit-news/:id"
              element={
                <ProtectedRoute>
                  <EditNews />
                </ProtectedRoute>
              }
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/manage-news"
              element={
                <ProtectedRoute>
                  <ManageNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-news"
              element={
                <ProtectedRoute>
                  <CreateNews />
                </ProtectedRoute>
              }
            />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
