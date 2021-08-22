import { ls } from "../../utils/Ls";

export function getApiUrl(){
	return getEnvironmentData().apiUrl;
}

export function getS3Url(){
	return getEnvironmentData().s3Url;
}

export function getEnvironment(){
	return ls.getItem('env') || 'local';
}

function getEnvironmentData(){
	return environments[ getEnvironment() ];
}

let environments: any = {
	local: {
		apiUrl: 'http://localhost:3030/dev',
		s3Url: 'http://localhost:4569/aws-trader-dev-exchanges'
	},
	awsTest: {
		apiUrl: 'https://b682acd3ie.execute-api.eu-west-1.amazonaws.com/dev',
		s3Url: 'https://aws-trader-dev-exchanges.s3-eu-west-1.amazonaws.com'
	}
}