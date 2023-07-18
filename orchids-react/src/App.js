import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Donate from './components/donate/Donate';
import HomePage from './components/home/HomePage';
import Login from './components/personal/Login';
import PersonalV2 from './components/personal/PersonalV2';
import { useState } from 'react';
import CreatePostPage from './components/create_post/CreatePost';
import PostPage from './components/post_page/PostPage';
import Team from './components/team/team_homepage/Team';
import NotFound from './components/error/404';
import TeamDashboard from './components/team/team_dashboard/TeamDashboard';
import QuestionPage from './components/question_page/QuestionPage';
import UpdatePostPage from './components/update_post/UpdatePost';
import SearchPage from './components/search_page/SearchPage';
import Dashboard from './pages/admin/Dashboard';
import ViewPersonal from './components/view_personal_page/ViewPerson';
import TeamHomepageContextProvider from './context/team/TeamHomepageContext';
import PopupShowCard from './components/question_page/PopupShowCard';
import QuestionLoadPage from './components/question_page/QuestionLoadPage';


function App() {
  /* global google */
  const [isLogin, setIsLogin] = useState(localStorage.getItem('token') ? true : false);

  return (
    <Router>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <Routes>
        <Route path="/" element={<HomePage isLogin={isLogin} setIsLogin={setIsLogin} />} />
        <Route path="/question" element={<HomePage isLogin={isLogin} setIsLogin={setIsLogin} />} />
        <Route path="/donate" element={<Donate />} />

        <Route path="/personal" element={isLogin ? <PersonalV2 /> : <Login setIsLogin={setIsLogin} />} />
        <Route path="/personal/info" element={isLogin ? <PersonalV2 selectPage={'infomation'} /> : <Login setIsLogin={setIsLogin} />} />
        <Route path="/personal/teams" element={isLogin ? <PersonalV2 selectPage={'manager-team'} /> : <Login setIsLogin={setIsLogin} />} />

        <Route path="/teams/:id" element={<TeamHomepageContextProvider><Team /></TeamHomepageContextProvider>} />


        <Route path="/create-post" element={isLogin ? <CreatePostPage /> : <Login setIsLogin={setIsLogin} />} />
        <Route path='/edit-post' element={isLogin ? <UpdatePostPage /> : <Login setIsLogin={setIsLogin} />} />
        <Route path="/post-page" element={<PostPage />} />
        <Route path="/question-page" element={<QuestionLoadPage />} />
        <Route path="search-page" element={<SearchPage />} />
        <Route path="/admin" element={localStorage.getItem('role') === 'AD' ? <Dashboard/> : <Navigate to={'/404'}/>} />
        <Route path="/view/user" element={<ViewPersonal />} />
        
        {/* Error pages */}
        <Route path="/404" element={<NotFound/>} />

        {/* TESTING */}
        <Route path="/test" element={<TeamDashboard />} />
      </Routes>
    </Router>
    // <Test />
  );
}

export default App;
