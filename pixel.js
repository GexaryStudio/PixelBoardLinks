let headersList = {
    Apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZ29uZmF0d2pueHZ1eWd0Ym9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1NzU3NzEsImV4cCI6MjAyNzE1MTc3MX0.kcoCC9_2usyO78eYKiIEuEn_2Zs0aj4Km5_vdrfiwyI",
};

fetch("https://zagonfatwjnxvuygtboi.supabase.co/rest/v1/pixels_map?select=*", {
    method: "GET",
    headers: headersList,
}).then((res) => {
    res.json().then((data) => {
        fetch("https://zagonfatwjnxvuygtboi.supabase.co/rest/v1/profiles?select=*", {
            method: "GET",
            headers: headersList,
        }).then((ress) => {
            ress.json().then((userData) => {
                data.sort((a, b) => {
                    return a.pixel_index - b.pixel_index;
                });
                generateTable(data, userData);
            });
        });
    });
});

function generateTable(data, userData) {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    // Clear existing table content
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (data.length === 0) {
        return;
    }

    // Generate table headers
    const headers = ["username", "pixel position", "color", "link"];
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        th.className = "px-4 py-2";
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    const tempList = [];
    // Generate table rows
    data.forEach((item) => {
        if (item.link === null || tempList.includes(item.link.toLowerCase())) return;
        tempList.push(item.link.toLowerCase());
        const row = document.createElement("tr");
        row.className = "border-t";

        headers.forEach((header) => {
            const td = document.createElement("td");
            td.className = "px-4 py-2";
            if (header.toLowerCase() === "color") {
                const colorValue = parseInt(item[header], 10);
                const colorHex = "#" + colorValue.toString(16).padStart(6, "0");

                const colorSquare = document.createElement("div");
                colorSquare.style.width = "20px";
                colorSquare.style.height = "20px";
                colorSquare.style.backgroundColor = colorHex;
                colorSquare.className = "inline-block";

                td.appendChild(colorSquare);
            } else if (header.toLowerCase() === "link") {
                const link = document.createElement("a");
                link.href = item[header];
                link.textContent = item[header];
                link.className = "text-blue-700 hover:underline";
                link.target = "_blank";
                td.appendChild(link);
            } else if (header.toLowerCase() === "username") {
                const username = findPlayerById(userData, item["owner_id"]);
                td.textContent = username.username;
            } else if (header.toLowerCase() === "pixel position") {
                td.textContent = item["pixel_index"];
            } else {
                td.textContent = item[header];
            }
            row.appendChild(td);
        });

        tableBody.appendChild(row);
    });
}

function findPlayerById(players, id) {
    return players.find((player) => player.id === id);
}
