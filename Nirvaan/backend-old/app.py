from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from retell import Retell
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

app = FastAPI()

# Get environment variables
AGENT_ID = os.getenv('AGENT_ID')
RETELL_API_KEY = os.getenv('RETELL_API_KEY')
FROM_PHONE_NUMBER = os.getenv('FROM_PHONE_NUMBER')


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Retell(api_key=RETELL_API_KEY)

call_details_dict = {}

class CallData(BaseModel):
    phone_number: str

@app.post("/submit")
async def submit_form(data: CallData):
    try:
        call = client.call.create_phone_call(
            retell_llm_dynamic_variables={},  # Remove the customer_name variable
            override_agent_id=AGENT_ID,
            from_number=FROM_PHONE_NUMBER,  # Change this to your valid number
            to_number=data.phone_number,
        )
        while True:
            call_status = client.call.retrieve(call.call_id).call_status
            if call_status == "ended":
                break
            time.sleep(1)
        call_id = call.call_id
        return JSONResponse(content=call_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initiating call: {str(e)}")

@app.get("/call-details/{call_id}")
async def get_call_details(call_id: str):
    try:
        call_details = client.call.retrieve(call_id)
        results_dict = {
            'summary': call_details.call_analysis.call_summary,
            'user_sentiment': call_details.call_analysis.user_sentiment,
            'transcript': call_details.transcript
        }
        return JSONResponse(content=results_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching call details: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8050, log_level="debug")
