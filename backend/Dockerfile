# Alusta ametlikust Go pildist
FROM golang:1.20 as builder

# Määrame töökausta
WORKDIR /app

# Koopia Go mod ja sum failid
COPY backend/go.mod backend/go.sum ./

# Paigalda sõltuvused
RUN go mod tidy

# Koopia ülejäänud failid
COPY backend/ .

# Kompileeri rakendus
RUN go build -o main .

# Loo lõpp-pilt
FROM gcr.io/distroless/base-debian10

# Koopia builditud fail eelmisest etapist
COPY --from=builder /app/main /app/

# Käivita rakendus
CMD ["/app/main"]

# Avasem port, mida rakendus kasutab
EXPOSE 8081