"use client"
import getStripe from "@/utils/get_stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Head from "next/head";
import { Container, AppBar, Button, Toolbar, Typography, Box, Grid } from "@mui/material";

export default function Home() {
  const handleSubmit = async () => {
    const checkOutSession = await fetch('/api/checkout_sessions', {
      method: "POST",
      headers:{
        origin: 'https://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkOutSession.json()
    
    if (checkOutSession.statusCode === 500){
      console.error(checkOutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }

  }
  return (
    <Container maxWidth="l00vw"  sx={{
      backgroundColor: 'beige',
      padding: '5px',
    }}>
      <Head>
        <title>
          Quick Learn
        </title>
        <meta name="description" content="Create flashcard from your text"/>

      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            Quick Learn
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{
        textAlign: 'center', my: 4
      }}>
        <Typography variant="h2" gutterBottom>Quick Learn</Typography>
        <Typography variant="h5" gutterBottom>
          The easiest way to make flashcards from scratch
        </Typography>
        <Button variant="contained" color="primary" sx={{st: 2}} href="/generate">
          Get Started
        </Button>
      </Box>
      <Box sx={{my: 6}}>
        <Typography variant="h4">
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              backgroundColor: '#fef68a', // Soft yellow color
              boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
              padding: 2,
              transform: 'rotate(-2deg)',
              borderRadius: '5px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(0deg)',
              }
            }}>
              <Typography variant="h6" gutterBottom>
                Easy Text Input
              </Typography>
              <Typography gutterBottom>
                Simply input your text and let our software generate the result. This is your study buddy.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              backgroundColor: '#fef68a',
              boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
              padding: 2,
              transform: 'rotate(1deg)',
              borderRadius: '5px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(0deg)',
              }
            }}>
              <Typography variant="h6" gutterBottom>
                Reliability
              </Typography>
              <Typography gutterBottom>
                Our AI breaks down your text into clear and concise flashcards.. your study buddy.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              backgroundColor: '#fef68a',
              boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
              padding: 2,
              transform: 'rotate(-1.5deg)',
              borderRadius: '5px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(0deg)',
              }
            }}>
              <Typography variant="h6" gutterBottom>
                Accessibility
              </Typography>
              <Typography gutterBottom>
                Access your flashcards anywhere from any device.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              backgroundColor: '#fef68a',
              boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
              padding: 2,
              transform: 'rotate(2.5deg)',
              borderRadius: '5px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(0deg)',
              }
            }}>
              <Typography variant="h6">
                Accuracy
              </Typography>
              <Typography>
                Our AI generates the best flashcards as well as accurate results.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey300',
              borderRadius: 2,
              backgroundColor: "white"
            }}>
              <Typography variant="h5" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                Free
              </Typography>
              <Typography gutterBottom>
                {' '}
                Access to basic flashcard features with limited storage
              </Typography>
              <Button variant="contained" color="primary" sx={{sx: 2}} href="/generate">
                Choose
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey300',
              borderRadius: 2,
              backgroundColor: "white"
            }}>
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5 / month
              </Typography>
              <Typography gutterBottom>
                {' '}
                Access to basic flashcard features with unlimited storage
              </Typography>
              <Button variant="contained" color="primary" sx={{sx: 2}} onClick={handleSubmit}>
                Choose
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{
        mt: 4,
        backgroundColor: '#fef68a',
        boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
        padding: 2,
        transform: 'rotate(-2deg)',
        borderRadius: '5px',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'rotate(0deg)',
        },
        textAlign: 'center'
      }}>
        <Typography variant="body1">
          Disclaimer: Pro features would be added later.
        </Typography>
      </Box>
      </Box>
    </Container>
  )
}
