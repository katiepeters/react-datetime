import { DbBot } from "../../../../lambdas/model.types";
import { ScreenProps } from "../../types";

export interface BotScreenProps extends ScreenProps {
	bot: DbBot
}