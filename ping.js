document.addEventListener('DOMContentLoaded', function() {
    const hosts = [
        { alias: "Host1", ip: "8.8.8.8", port: 443 },
    ];

    const resultsDiv = document.getElementById('results');

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchWithTimeout = (url, options, timeout = 5000) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), timeout)
            )
        ]);
    };

    const pingHost = async (host) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result';
        resultDiv.innerText = `Pinging ${host.alias}... `;
        resultsDiv.appendChild(resultDiv);

        const startTime = performance.now();

        try {
            await fetchWithTimeout(`http://${host.ip}:${host.port}`, { mode: 'no-cors' }, 5000);
            const endTime = performance.now();
            const latency = (endTime - startTime).toFixed(2);

            const tick = document.createElement('span');
            tick.className = 'tick';
            tick.innerHTML = `&#10004; (Latency: ${latency} ms)`;  // Unicode character for tick
            resultDiv.appendChild(tick);
        } catch (error) {
            const endTime = performance.now();
            const latency = (endTime - startTime).toFixed(2);

            const cross = document.createElement('span');
            cross.className = 'cross';
            cross.innerHTML = `&#10008; (Latency: ${latency} ms)`;  // Unicode character for cross
            resultDiv.appendChild(cross);
        }
    };

    const pingHosts = async () => {
        for (const host of hosts) {
            await pingHost(host);
            await sleep(100);
        }
    };

    pingHosts();
});
