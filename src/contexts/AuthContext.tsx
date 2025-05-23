
const register = async (email: string, password: string, name: string) => {
  setIsLoading(true);
  try {
    // Clean up existing auth state first
    cleanupAuthState();
    
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        // Use the full domain for email verification
        emailRedirectTo: `https://myawaaz.com/verify`,
      },
    });
    
    if (error) throw error;
    
    if (data && data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          display_name: name,
        });
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    }
    
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: error.message || "Could not create account",
    });
  } finally {
    setIsLoading(false);
  }
};
