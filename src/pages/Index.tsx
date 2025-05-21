
import { useAuth } from "@/contexts/AuthContext";
import RecordPage from "./RecordPage";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const { user } = useAuth();
  
  return user?.isLoggedIn ? <RecordPage /> : <AuthForm />;
};

export default Index;
