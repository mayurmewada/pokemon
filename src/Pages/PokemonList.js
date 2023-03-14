import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PokemonList = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const observer = useRef();
  const lastPokemonRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setOffset((prevOffset) => prevOffset + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    setLoading(true);
    const getAllPokemon = async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
      );
      const data = response.data.results;

      const pokemonData = await Promise.all(
        data.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          // console.log(pokemonResponse.data.abilities);
          return {
            name: pokemon.name,
            image:
              pokemonResponse.data.sprites.other["official-artwork"]
                .front_default,
                height: pokemonResponse.data.height,
                weight: pokemonResponse.data.weight,
                abilities: pokemonResponse.data.abilities,
          };
        })
      );

      setPokemonList((prevList) => [...prevList, ...pokemonData]);
      setLoading(false);
    };
    getAllPokemon();
  }, [offset]);

  const handleCardClick = (pokemon) => {
    // console.log(pokemon);
    setSelectedPokemon(pokemon);
  };

  const handleClose = () => {
    setSelectedPokemon(null);
  };

  return (
    <Container maxWidth="lg">
      <h1>Pokemon List</h1>
      <Grid container spacing={2}>
        {pokemonList.map((pokemon, index) => {
          if (index === pokemonList.length - 1) {
            return (
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card
                  onClick={() => handleCardClick(pokemon)}
                  key={pokemon.name}
                  ref={lastPokemonRef}
                  sx={{ maxWidth: 345 }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      //   height="140"
                      image={pokemon.image}
                      alt={pokemon.name}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        align="center"
                        variant="h5"
                        component="div"
                      >
                        {pokemon.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          } else {
            return (
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Card
                  onClick={() => handleCardClick(pokemon)}
                  key={pokemon.name}
                  sx={{ maxWidth: 345 }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      //   height="140"
                      image={pokemon.image}
                      alt={pokemon.name}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        align="center"
                        variant="h5"
                        component="div"
                      >
                        {pokemon.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          }
        })}
      </Grid>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={selectedPokemon !== null}
        onClose={handleClose}
      >
        <DialogTitle>{selectedPokemon?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img src={selectedPokemon?.image} alt={selectedPokemon?.name} />
            <Typography>
              Height: {selectedPokemon?.height} decimetres
            </Typography>
            <Typography>
              Weight: {selectedPokemon?.weight} hectograms
            </Typography>
            {selectedPokemon?.abilities.map((ability, i) => {
              // console.log(ability.ability.name);
              return(
                <Typography>
                Ability {i+1}: {ability.ability.name}
              </Typography>
              )
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PokemonList;
