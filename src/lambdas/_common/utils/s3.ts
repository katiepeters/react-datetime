const AWS = require('aws-sdk');

let s3Options: any = { region: process.env.region };
if (process.env.IS_OFFLINE) {
	console.log('LOCAL ENVIRONMENT');
	s3Options = {
		s3ForcePathStyle: true,
		accessKeyId: 'S3RVER', // This specific key is required when working offline
		secretAccessKey: 'S3RVER',
		endpoint: new AWS.Endpoint('http://localhost:4569'),
	};
}
else {
	console.log('WE ARE IN AWS', process.env.region);
}

const S3 = new AWS.S3(s3Options);

console.log('Bucket name', process.env.STATE_BUCKET);

interface S3Response {
	error: any
}
interface S3Accessor {
	setContent( path: string, content: string, metadata?: any ): Promise<S3Response>
	getContent( path: string ): Promise<string|undefined>
	delObject( path: string ): Promise<S3Response>
}

interface S3Helper {
	botState: S3Accessor,
	exchanges: S3Accessor
}

const s3Helper: S3Helper = {
	// @ts-ignore
	botState: createAccessor(process.env.STATE_BUCKET),
	// @ts-ignore
	exchanges: createAccessor(process.env.EXCHANGES_BUCKET)
}

function createAccessor( bucket: string ): S3Accessor {
	return {
		setContent( path: string, content: string, metadata?: any ) {
			const payload = {
				ContentType: 'text/plain',
				...metadata,
				Bucket: bucket,
				Key: path,
				Body: content
			};

			console.log('setting s3 content', path);

			return S3.putObject( payload ).promise()
				.then( data => {
					console.log('setOk', data );
					return {error: false};
				})
				.catch( err => {
					console.error('setError', err);
					return {error:err};
				})
			;
		},
		getContent( path: string ){
			const payload = {
				Bucket: bucket,
				Key: path
			}

			console.log('getting s3 content', path);
			return S3.getObject( payload ).promise()
				.then( data => {
					return data.Body.toString();
				})
				.catch( err => {
					console.log('error getting s3', path, err);
				})
			;
		},
		delObject( path: string ) {
			const payload = {
				Bucket: bucket,
				Key: path
			}
			console.log('deleting s3 content', path);
			return S3.deleteObject(payload).promise()
				.then(data => {
					console.log('delOk', data);
					return { error: false };
				})
				.catch(err => {
					console.error('delError', err);
					return { error: err };
				})
			;
		}
	}
}

export default s3Helper;