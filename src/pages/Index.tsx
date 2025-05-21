
import { useAuth } from "@/contexts/AuthContext";
import HomePage from "./HomePage";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const { user } = useAuth();
  
  return user?.isLoggedIn ? <HomePage /> : <AuthForm />;
};

export default Index;
