const User = require('../models/User');

// Users
const findUsersBySearch = async (searchTerm) => {
    let userList = await User.find();

    if (!searchTerm) return [];

    const regex = new RegExp(searchTerm.replace(/\s+/g, ""), "i");

    return userList.filter(user => {
        const usernameClean = (user.user_name || "").replace(/\s+/g, "");
        return regex.test(usernameClean) && user.user_name !== "Spotimate";
    });
};

const findUserByUsername = async (username) => {
    return await User.findOne({ user_name: username });
};


// Spotify requests
const getAccessToken = async () => {
    const user = await User.findOne({ user_name: "Turn down?" });
    return user?.accessToken;
};

const spotifySearch = async (type, searchTerm) => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error("Access token manquant");
    }

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=${type}&limit=10`,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    );

    const data = await response.json();

    return data[type + "s"]?.items?.slice(0, 5) || [];
};


module.exports = {
    findUsersBySearch,
    findUserByUsername,
    spotifySearch
};