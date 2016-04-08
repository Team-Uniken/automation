#Gateway Performance Benchmarks

##Performance considering a basic http payload(Per second): 
	1. Total number of requests (millions)
	2. Total amount of content sent (TB) 
	3. Number of TCP connections (millions) 
	4. Number of unique IP addresses, end points (millions)

##Details:
	- Hardware : 2 modern x86_64 CPUs with 4 to 8 cores per CPU, 16 to 32 GB RAM
	- 6 x 250-GB SSD drives (if required for cache and storage), 10-GbE Intel networking card

##Proposed Benchmarks:
	- **TCP Throughput:** Raw capability of Gateway server to pass bits per second or packets per second from interface to interface; similar to router and switch metrics
	- **New Connections per second:** Speed at which Gateway server can set up connections and the full handshake to establish a TCP/IP session.
	- **Concurrent Connections (connection backlog):** Total number of open connections through the Gateway server at any given moment
	- **Latency: Max IO Operations:** Maximum number of IO operations permitted on the Gateway server
	- **Time traffic** is delayed in the Gateway server, added to the total end-to-end delay of the network. Should be measured in milliseconds at an offered load near the firewall’s limit
	- **Connection Teardown Time @ multiple connection concurrency:** Speed at which firewalls can tear down connections and free resources to be used for other traffic
	- **Time to establish 1 Million connections:** Time taken to establish 1 Million connections on the Gateway server
	- **Time to serve 1 Million requests:** Time taken to process 1 Million requests by the Gateway server

##Thigns to consider:
	- Throughput Rate
	- Connection Rate
	- Drop Queue Rate
	- Memory Consumption


