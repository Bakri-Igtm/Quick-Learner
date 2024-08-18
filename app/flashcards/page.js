'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, setDoc} from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { CardActionArea, AppBar, Toolbar, Box, Card, CardContent, Container, Grid, Typography } from "@mui/material"

export default function Flashcard(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(()=>{
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else{
                await setDoc[docRef, {flashcards: []}]
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardclick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: 'beige',
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
        }}>
            <Typography variant="h2" component="h1" sx={{
                mb: 4, 
                color: 'black', 
                fontWeight: 'bold',
            }}>
                Quick Learn
            </Typography>
            <Typography variant="h5" component="h1" sx={{
                mb: 4, 
                color: 'black', 
            }}>
                My Flashcard Collection
            </Typography>
            <Box sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'grey300',
              borderRadius: 2,
              backgroundColor: "white"
            }}>
                <Box sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey300',
                borderRadius: 2,
                backgroundColor: "beige"
                }}>
                    <Box sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey300',
                    borderRadius: 2,
                    backgroundColor: "white"
                    }}>
                        <Container maxWidth="md" sx={{backgroundColor:"white"}}>
                            <Grid container spacing={3} sx={{ mt: 4 }}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardclick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                        {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                </Card>
                                </Grid>
                            ))}
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </Box>
    </Box>
    )
}