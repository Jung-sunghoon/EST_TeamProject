import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login/Login'; // Login 컴포넌트의 실제 경로에 맞게 수정하세요
import SignUp from './pages/auth/signup/SignUp';
import RecipeDetail from './pages/recipedetail/RecipeDetail';
import Layout from './layout/Layout';
import RecipeList from './pages/recipelist/RecipeList';
import Home from './pages/home/Home';
import { AuthProvider } from './context/AuthContext';
import ForgotPassword from './pages/auth/login/ForgotPassword';
import NotFound from './pages/auth/notfound/NotFound';
import Profile from './pages/auth/profile/Profile';
import AddAndEdit from './pages/addandedit/AddAndEdit';

function App() {
	return (
		<>
			<AuthProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create" element={<AddAndEdit />} />
						<Route path="/edit/:id" element={<AddAndEdit />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/recipedetail/:id" element={<RecipeDetail />} />
						<Route path="/recipelist" element={<RecipeList />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Layout>
			</AuthProvider>
		</>
	);
}

export default App;
