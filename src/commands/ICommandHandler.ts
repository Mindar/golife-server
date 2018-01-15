export default interface ICommandHandler {
	command: string;
	handle(payload?: any): boolean;
}