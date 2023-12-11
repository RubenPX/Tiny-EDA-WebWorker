export const consoleDecorations = {
	RoundedBorder: (color: string) => `border-left: 2px solid ${color}; border-right: 2px solid ${color}; padding: 0 4px; border-radius: 5px; `
};

export const ConsoleColors = {
	green  : 'color: #0d0; ',
	blue   : 'color: #0af; ',
	red    : 'color: #f20; ',
	orange : 'color: #F80; ',
	purple : 'color: #d602ee; '
};

// eslint-disable-next-line no-undef
export const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
export const workerLetter = isWorker ? 'W' : 'C';

export const ConsolePrefix = {
	sendMsg            : [`%c${workerLetter}⮞`, ConsoleColors.orange + consoleDecorations.RoundedBorder('#F80')],
	reciveMsg          : [`%c${workerLetter}⮜`, ConsoleColors.green + consoleDecorations.RoundedBorder('#0d0')],
	Error              : [`%c${workerLetter}⭙`, ConsoleColors.red + consoleDecorations.RoundedBorder('#f20')],
	ObserverRegister   : [`%c${workerLetter}⭘`, ConsoleColors.purple + consoleDecorations.RoundedBorder('#d602ee')],
	ObserverUnRegister : [`%c${workerLetter}⮾`, ConsoleColors.purple + consoleDecorations.RoundedBorder('#d602ee')]
};
