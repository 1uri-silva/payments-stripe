
# payment stripe
Project for learning purposes about Stripe and webhooks.

Credits for this [VIDEO YOUTUBE](https://www.youtube.com/watch?v=W7x3zsm8NoM)

## Enviroments variables

To run this project, you'll need to add the following environment variables to your .env file.

`DATABASE_URL`  
`POSTGRES_USER`  
`POSTGRES_PASS`  
`POSTGRES_DB`

`STRIPE_PRICE_KEY=price_"`  
`STRIPE_PRIVATE_KEY_WH=whsec_`  
`STRIPE_PRIVATE_KEY=sk_test_`  


## Install guide

- Clone this repository.

```bash
  git clone https://github.com/1uri-silva/payments-stripe.git
```
- Enter the directory and install dependencies.

```bash
cd payments-stripe &&  npm install
```

- Run code

```bash
docker compose up -d
```

- In a terminal, run the code:

```bash
npm run dev
```

Download the Stripe CLI and set up the login. [stripe cli](https://docs.stripe.com/stripe-cli)
- In another terminal, run the code:

```bash
stripe listen --forward-to localhost:2000/webhook 
# Establish the connection of Stripe with the local server to receive webhook events.
```

