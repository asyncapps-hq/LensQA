FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app
USER root
COPY package.json package-lock.json* ./
COPY apps/demo-store/package.json apps/demo-store/
COPY packages/shared/package.json packages/shared/
COPY packages/runner/package.json packages/runner/
COPY packages/sdk/package.json packages/sdk/
COPY apps/web/package.json apps/web/
RUN npm install --workspace=@lensqa/demo-store --workspace=@lensqa/shared --workspace=@lensqa/runner --ignore-scripts
COPY . .
RUN npm run build -w @lensqa/shared || true
USER pwuser
WORKDIR /app/packages/runner
CMD ["npx", "playwright", "test"]
