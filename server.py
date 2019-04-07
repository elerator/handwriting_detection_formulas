import http.server
import socketserver
import threading

class CORSRequestHandler (http.server.SimpleHTTPRequestHandler):
    """ Ensures that server allows for cross domain requests """
    def end_headers (self):
        #allow cross site requests:
        self.send_header('Access-Control-Allow-Origin', '*')

        #no caching:
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        http.server.SimpleHTTPRequestHandler.end_headers(self)

PORT = 1234
Handler = CORSRequestHandler

def start_server():
    """ Starts server """
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("serving at port", PORT)
        httpd.serve_forever()

if __name__ == "__main__":
    thread = threading.Thread(target=start_server)
    thread.start()#Start server as non-blocking thread
