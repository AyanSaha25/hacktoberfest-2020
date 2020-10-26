import threading
import socket


host = '127.0.0.1'
port = 55556

# Starting Server
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((host, port))
server.listen()

clients = []
aliases = []

def broadcast(message):    # send the message to whole network
    for client in clients:
        client.send(message)


def handle(client):
    while True:
        try:
            message = client.recv(1024)
            broadcast(message)
        except:
            index = clients.index(client)
            clients.remove(client)
            client.close()
            alias = aliases[index]
            broadcast(f'{alias} left the chat'.encode('ascii'))
            aliases.remove(alias)
            break

def receive():
    while True:
        client, address = server.accept() # confirm connection
        print(f'connected with {str(address)}')

        client.send('NICK'.encode('ascii')) # nickname storage
        alias = client.recv(1024).decode('ascii')
        aliases.append(alias)
        clients.append(client)

        print(f'Nickname of the client is {alias}')
        broadcast(f'{alias} joined the chat!'.encode('ascii'))
        client.send('Connected to the server!'.encode('ascii'))


        thread = threading.Thread(target=handle, args=(client,))
        thread.start()



print("server is listening")
receive()        

         
