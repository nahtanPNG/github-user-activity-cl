#! /usr/bin/env node

async function fetchGithubActivity(username) {
    const response = await fetch(`https://api.github.com/users/${username}/events`)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("User not found");
        } else {
            throw new Error(`Error fetching data: ${response.status}`);
        }
    }

    return response.json();
}

function handleGithubEvents(events) {

    if(events.length === 0) {
        console.log("No activity found");
        return;
    }

    events.forEach((event) => {
        let message;
        switch (event.type) {
            case "PushEvent":
                message = `Pushed ${event.payload.size} commits to ${event.repo.name}`;
                break
            case "CreateEvent":
                message = `Created ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
                break
            case "ForkEvent":
                message = `Forked ${event.payload.forkee.full_name} to ${event.repo.name}`;
                break
            case "DeleteEvent":
                message = `Deleted ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
                break
            case "WatchEvent":
                message = `Starred ${event.repo.name} repository`;
                break
        }

        console.log(`${event.actor.login} - ${message}`);
    })

}

// Taking the username from the command line
const username = process.argv[2];

if(!username) {
    console.error("Please Provide a username");
    process.exit(1);
}

fetchGithubActivity(username).then((events) => {
    handleGithubEvents(events)
    }).catch((error) => {
    console.error(error);
    process.exit(1);})
