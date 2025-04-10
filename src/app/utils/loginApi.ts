export const loginUser = async (
  username: string,
  password: string
): Promise<{ token: string; id: number; username: string }> => {

  const response = await fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  const data = await response.json();
  const token = data.token;

  const usersRes = await fetch('https://fakestoreapi.com/users');
  const users: { id: number; username: string }[] = await usersRes.json(); 

  const matchedUser = users.find((user) => user.username === username); 

  if (!matchedUser) {
    throw new Error('User not found');
  }

  return {
    token,
    id: matchedUser.id,
    username: matchedUser.username,
  };
};
