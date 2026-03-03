#!/bin/sh
set -e
# S'assurer que /data est accessible en écriture par nextjs (volume Docker)
mkdir -p /data
chown -R nextjs:nodejs /data
exec su-exec nextjs "$@"
