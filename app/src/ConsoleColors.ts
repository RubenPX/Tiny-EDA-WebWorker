export const consoleDecorations = {
	RoundedBorder: (color: string) => `border-left: 2px solid ${color}; border-right: 2px solid ${color}; padding: 0 4px; border-radius: 5px; `
};

export const ConsoleColors = {
	green  : 'color: #0d0; ',
	blue   : 'color: #0af; ',
	red    : 'color: #f20; ',
	orange : 'color: #F80; '
};

export const ConsolePrefix = {
	MsgOut            : ['%c⮞', ConsoleColors.green + consoleDecorations.RoundedBorder('#0d0')],
	MsgIn             : ['%c⮜', ConsoleColors.blue + consoleDecorations.RoundedBorder('#0af')],
	Error             : ['%c⭙', ConsoleColors.red + consoleDecorations.RoundedBorder('#f20')],
	ObserverRegister  : ['%c⭘', ConsoleColors.blue + consoleDecorations.RoundedBorder('#0af')],
	ObserverTriggered : ['%c⊚', ConsoleColors.orange + consoleDecorations.RoundedBorder('#F80')]
};
