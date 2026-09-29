"""Local entry point. Production: run api:app behind a trusted HTTPS proxy."""
import argparse
import uvicorn
if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8793)
    args=parser.parse_args()
    uvicorn.run('api:app',host='127.0.0.1',port=args.port,access_log=False)
