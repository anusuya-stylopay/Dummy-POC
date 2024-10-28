const sessionIdToUserMap = new Map();

async function setUser(id, user) {
  const session = {
    user,
    createdAt: Date.now(), // Store the session creation time
  };
  console.log(`Setting user for session ID: ${id}`);
  return sessionIdToUserMap.set(id, session);
}

async function getUser(id) {
  console.log(`Looking for user with session ID: ${id}`);
  const session = await sessionIdToUserMap.get(id);

  if (!session) {
    console.log(`No user found for session ID: ${id}`);
    return null;
  }

  // Check if the session is expired
  const currentTime = Date.now();
  const sessionAge = currentTime - session.createdAt; // Calculate session age
  const maxAge = 30 * 60 * 1000; // 30 minutes

  if (sessionAge > maxAge) {
    console.log(`Session expired for session ID: ${id}`);
    sessionIdToUserMap.delete(id); // Remove the session if expired
    return null;
  }

  console.log(`User found: ${JSON.stringify(session.user)}`);
  return session.user;

  // return session;
}

module.exports = {
  setUser,
  getUser,
};
