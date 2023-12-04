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
const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

export const ConsolePrefix = {
	Msg: isWorker
		? ['%c⮜W', ConsoleColors.green + consoleDecorations.RoundedBorder('#0d0')]
		: ['%cC⮞', ConsoleColors.blue + consoleDecorations.RoundedBorder('#0af')],
	Error             : ['%c⭙', ConsoleColors.red + consoleDecorations.RoundedBorder('#f20')],
	RequireObserve    : ['%c⭘', ConsoleColors.blue + consoleDecorations.RoundedBorder('#d602ee')],
	ObserverRegister  : ['%c⭘', ConsoleColors.green + consoleDecorations.RoundedBorder('#d602ee')],
	ObserverTriggered : ['%c⊚', ConsoleColors.green + consoleDecorations.RoundedBorder('#d602ee')]
};
