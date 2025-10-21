'use client'

import { Box, Typography, Container } from '@mui/material'

export default function Home() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Soccer Field Management
        </Typography>
        <Typography variant="body1">
          Welcome to the Soccer Field Management System
        </Typography>
      </Box>
    </Container>
  )
}