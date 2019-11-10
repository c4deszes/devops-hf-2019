#Build both projects, unless --skip-build is specified
if [ "$1" != "--skip-build" ]; then
	(cd ../chat-backend && npm run build)
	(cd ../chat-frontend && npm run build)
fi

#Copy backend build output into the docker context
mkdir build -p
cp -R ../chat-backend/env build
cp -R ../chat-backend/dist build
cp ../chat-backend/package.json build/package.json
cp ../chat-backend/package-lock.json build/package-lock.json

#Copy frontend build output
cp -R ../chat-frontend/build build

#Run docker build
docker build -t devops-hf/chat-home build -f Dockerfile