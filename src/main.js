import './style.scss';
import { readFile } from './lib.js';

class Terminal {
    constructor(buffer) {
        // Настройки терминала
        this.config = {
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
            'test': {
                'description': 'Test', 
                'method': this.test
            },
            'welcome': {
                'descrption': 'Приветсвие',
                'method': this.welcome,
                'private': true
            }
        };

        this.buffer = buffer;
        this.welcome();
        this.#addCommandLine();
        
        // Активация клавиатуры
        document.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
                let command = this.commandLine.textContent;
                if (command != '') {
                    if (this.commands[command]['method']) {
                        this.commands[command]['method'].call(this);
                    }  else {

                    }
                    this.#addCommandLine();
                }
            } else if (event.key == 'Backspace') {
                this.commandLine.innerHTML = this.commandLine.innerHTML.slice(0, -1);
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
        this.output(readFile('content/welcome.txt'));
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
            }, 5*counter);
            counter++;
        });
    }

    #getLine(line) {
        let out = '';
        for (let char of line) {
            if (char == ' ') {
                char = '&nbsp;'
            }
            out += `<span class="retro-terminal-char">${char}</span>`
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
}

const t = new Terminal(document.querySelector('.buffer'));