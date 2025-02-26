# TdA25 - SUISEI SQUAD

## Členové týmu

- [Jiří Vařejka](https://github.com/Jiraxd) Discord: j1r4
- [Ondřej Lenikus](https://github.com/ondatraCZ) Discord: ondatracze

## Tech-stack aplikace

*FE*
- NextJS
- TailwindCSS
- shadcn/ui
- TypeScript
- React

*BE*
- SpringBoot
- PostgreSQL
- lombok
- Maven


## Kompilace a spuštění aplikace na [localhost:8080](http://localhost:8080)

**Lze využít Dockerfile v root adresáři pro vytvoření image**


- Naklonování repository

**FE:**

- Spuštění `npm install` pro stažení všech packages pro FE
  
*Čistě FE lze spustit pomocí `npm run dev` na [localhost:3000](http://localhost:3000) bez nutnosti buildu*


- `npm run build` => FE bude vygenerován do složky `TdA25-SUISEI-SQUAD\FE\tda25-fe\out`
*Z důvodu omezení v odevzdávání (možnost spustit pouze jednu aplikaci na jednom portu) BE musí předávat FE, jinak by FE a BE běželi na svých vlastních portech (o Nginx víme, ale takto je to nejjednodušší způsob)*

- Celý obsah složky out zkopírujeme do `TdA25-SUISEI-SQUAD\BE\TdA25-BE\src\main\resources\static`



**BE:**

*V IntelliJ IDEA lze BE zapnout přidáním základní SpringBoot aplikace a spuštěním*


- Ve složce `TdA25-SUISEI-SQUAD\BE\TdA25-BE\` spustit příkaz v CMD `mvnw clean install`

- Ve složce `TdA25-SUISEI-SQUAD\BE\TdA25-BE\` spustit příkaz v CMD `mvnw spring-boot:run -D spring-boot.run.arguments=--server.port=8080`

*Po spuštění BE bude dostupný i FE na [localhost:8080](http://localhost:8080)*


  

