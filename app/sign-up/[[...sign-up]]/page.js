import { SignUp } from "@clerk/nextjs";
import { AppBar, Box, Link, Button, Container, Toolbar, Typography } from "@mui/material";

export default function signUpPage(){
    return <Container maxWidth="100vw" sx={{padding: "5px"}}>
        <AppBar position="static" sx={{backgroundColor: "3f51b5"}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1,}}>
                    Quick Learn
                </Typography>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Login
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign-Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h4">
                Sign-Up
            </Typography>
            <SignUp />
        </Box>
    </Container>

}