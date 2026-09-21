import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpfService {

  validarCPF(cpf: string): boolean {
    if (!cpf || !/^[\d.\-\s]+$/.test(cpf)) {
      return false;
    }

    const digitos = cpf.replace(/\D/g, '');

    if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
      return false;
    }

    const primeiroVerificador = this.calcularDigito(
      digitos.substring(0, 9)
    );

    const segundoVerificador = this.calcularDigito(
      digitos.substring(0, 9) + primeiroVerificador
    );

    return digitos === digitos.substring(0, 9) + primeiroVerificador + segundoVerificador;
  }

  private calcularDigito(base: string): number{
    let soma = 0;
    const pesoInicial = base.length + 1;

    for (let indice = 0; indice < base.length; indice++) {
      soma += Number(base[indice]) * (pesoInicial - indice);
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }
}
