import { DBBotDeploymentWithHistory } from "../../../../lambdas/model.types";
import { ScreenProps } from "../../types";

export interface SingleDeploymentScreenProps extends ScreenProps {
	deployment: DBBotDeploymentWithHistory
}