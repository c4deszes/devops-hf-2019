
declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		HOST: string;
		CORS_DISABLED: string;

		K8S_NAMESPACE: string;
	}
}