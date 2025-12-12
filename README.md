# whatsapp bot for crypto app

a simple automation that connects a form to google sheets through n8n, with some smart api testing built in.

## how it works

the whole flow is pretty straightforward:

1. **form submission** - user fills out a form with their info
2. **rudderstack destination** - form data gets sent to rudderstack, which forwards it to my n8n webhook
3. **n8n automation** - n8n picks up the webhook payload and processes it
4. **google sheets** - the data gets saved as a new row in a pre-configured google sheet

## the testing part

beyond just the basic form-to-sheets flow, i added some simulated api responses to test the automation logic. basically:

- made fake endpoints that return different response types
- based on what comes back from these "api calls", the automation triggers different processes
- this lets me test the entire flow without hitting real apis or dealing with actual crypto transactions

## why this matters

this setup lets you:
- quickly prototype automation flows without backend infrastructure
- test different scenarios by simulating various api responses
- keep everything organized in a spreadsheet for easy review
- scale up when ready by swapping simulated endpoints with real ones

it's a low-friction way to build and test whatsapp bot interactions before going live with actual crypto operations.
