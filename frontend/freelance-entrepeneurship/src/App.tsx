import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";

function App() {
	return (
		<>
			<BrowserRouter>
				<div className="min-h-screen bg-gray-50">
					<Routes>
						<Route path="/reset-password" element={<ResetPassword />} />
					</Routes>
				</div>
			</BrowserRouter>
		</>
	);
}

export default App;
