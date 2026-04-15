  let colors = ['green', 'red', 'yellow', 'blue'];
    let cpuSequence = []
    let currentUserStep = 0

    function start() {

        addColorTocpuSequence()
        drawcpuSequence()
    }

    function clickColor(color) {

        if (cpuSequence[currentUserStep] != color) {
            alert('Has perdido!')
            return
        }

        currentUserStep++

        if (currentUserStep == cpuSequence.length ) {
            currentUserStep = 0
            addColorTocpuSequence()
            console.log(cpuSequence)
            drawcpuSequence()
        }
    }

    function drawcpuSequence() {
        for (let i = 0; i < cpuSequence.length; i++) {
            setTimeout(() => {
                let currentColor = cpuSequence[i];
                let element = document.getElementById(currentColor);
                element.classList.add('light');
            }, 1000 * i);

            setTimeout(() => {
                let currentColor = cpuSequence[i];
                let element = document.getElementById(currentColor);
                element.classList.remove('light');
            }, 1000 * i + 600);
        }
    }


    function addColorTocpuSequence() {
        let rand = Math.floor(Math.random() * colors.length);
        let color = colors[rand];
        cpuSequence.push(color);
    }