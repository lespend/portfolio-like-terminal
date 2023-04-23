import './style.scss';
import { getMobileUiElements, readFile, responsiveTitle, scrollHeightListener } from './lib.js';

class Terminal {
    constructor(buffer, commands = {}) {
        // Настройки терминала
        this.config = {
            'outputCharDelay': 8,
            'commandLinePrefix': '>',
            'keyboardRegexp': /[a-zA-Zа-яА-ЯёЁ0-9]/g,
        }

        // Доступные команды, для выполнения
        this.commands = {
            'help': {
                'description': 'Выводит список доступных команд',
                'method': this.help
            },
            'clear': {
                'description': 'Очищает терминал',
                'method': this.clear
            },
            // 'test': {
            //     'description': 'Test', 
            //     'method': this.test
            // },
            'welcome': {
                'description': 'Выводит приветствие',
                'method': this.welcome
            }
        };

        this.addCommands(commands);
        this.buffer = buffer;
        this.welcome();
        this.#addCommandLine();
        scrollHeightListener(this.buffer, () => { this.commandLine.scrollIntoView() })
        
        // Активация клавиатуры
        document.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
                this.inputHandler();
            } else if (event.key == 'Backspace') {
                this.commandLine.textContent = this.commandLine.textContent.slice(0, -1);
            } else if (event.key == ' ') {
                this.commandLine.innerHTML = this.commandLine.innerHTML + '&nbsp;';
            } else if (event.key.match(this.config.keyboardRegexp)?.length == 1 && event.key.length == 1) {
                this.commandLine.innerHTML += event.key;
            }
        });
    }

    help() {
        let text = '';
        for (let key of Object.keys(this.commands)) {
            text += `${key} - ${this.commands[key]['description']}\n`
        }
        this.output(text);
    }

    clear() {
        this.buffer.innerHTML = '';
    }

    test() {
        this.output(';asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsfv;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf;asjflasjfl;ajslfjaslkfjalksjf;lkajsf;lkajsflkjaslfjalsf')
    }

    welcome() {
        this.outputHTML(readFile('content/welcome.html'));
    }

    outputHTML(text) {
        let elements = new DOMParser().parseFromString(text, 'text/html').body;
        // Рекурсивный обход по HTML элементам и изменение их текстового содержимого 
        let run = (element) => {
            if (element.children.length != 0 ) {
                for (let child of element.children) {
                    run(child);
                }
            } else {
                if (element?.textContent) {
                    element.innerHTML = this.#getLine(element.textContent);
                }
            }
        }

        run(elements);

        this.buffer.append(...elements.children)
        
        let notShown = this.buffer.querySelectorAll('.retro-terminal-char:not(.shown)');
        let counter = 0;
        for (let el of notShown) {
            counter += 1;
            setTimeout(() => {
                el.classList.add('shown');
            }, this.config.outputCharDelay * counter)
        }
    }

    output(text) {
        let lines = text.split('\n');
        let out = '';
        for (let line of lines) {
            out += `<p class="retro-terminal-line">${this.#getLine(line)}</p>`
        }

        // Возможно костыль, но я не придумал как отменить анимацию ввода текстадля предыдущих элементов
        this.buffer.querySelectorAll('.retro-terminal-char.shown').forEach((element) => {
            element.classList.add('disable-animation');
        })

        this.buffer.innerHTML += out;
        let counter = 0;
        this.buffer.querySelectorAll('.retro-terminal-char:not(.shown)').forEach((el) => {
            setTimeout(() => {
                el.classList.add('shown');
            }, this.config.outputCharDelay*counter);
            counter++;
        });
    }

    #getLine(line) {
        let out = '';
        for (let char of line) {
            if (char == ' ') {
                char = '&#32;'
            }
            out += `<div class="retro-terminal-char">${char}</div>`
        }
        return out;
    }

    // Добавляет командную строку в конец буффера
    #addCommandLine() {
        this.buffer.insertAdjacentHTML('beforeend', 
        `<p class="command-line">
            <span class="command-line__prefix">${this.config.commandLinePrefix}</span>
            <span class="command-line__text"></span>
        </p>`);

        let allComandLines = this.buffer.querySelectorAll('.command-line__text');
        // Хранит активный элемент командной строки
        this.commandLine = allComandLines[allComandLines.length - 1];
        
        // Меняем расположение каретки
        document.querySelector('.caret')?.classList.remove('caret');
        this.commandLine.classList.add('caret');
    }

    inputHandler() {
        let command = this.commandLine.textContent.trim();
        if (command != '') {
            if (this.commands[command]) {
                this.commands[command]['method'].call(this);
            }  else {
                this.output('Кажется такой команды не существует.\nВоспользуйтесь help')
            }
            this.#addCommandLine();
        }
    }

    addCommands(commands) {
        for (let [key, value] of Object.entries(commands)) {
            this.commands[key] = commands[key];
        }
    }
}

const t = new Terminal(document.querySelector('.buffer'));
t.addCommands({
    'about': {
        'description': 'Обо мне',
        'method': () => { t.outputHTML(readFile('content/about-me.html')) },
    },
    'projects': {
        'description': 'Проекты',
        'method': () => { t.outputHTML(readFile('content/projects.html')) }
    }
});

getMobileUiElements(t);