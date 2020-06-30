/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef } from 'react';
import MaterialTable, {
  Column, Query, QueryResult, Localization,
} from 'material-table';
import { AxiosRequestConfig } from 'axios';
import api from '../../service/api';

interface Row {
  id: string;
  nome: string
  parentesco: string
  cpf_numero: string
  rg_numero_registro: string
  rg_data_espedicao: string
  rg_emissor: string
  rg_nome_pai: string
  rg_nome_mae: string
}

export default function TableResponsavel() {
  const tableRef = useRef<any>();

  const columns: Column<Row>[] = [
    { title: 'Nome', field: 'nome' },
    { title: 'Parentesco', field: 'parentesco' },
    { title: 'Número do CPF', field: 'cpf_numero' },
    { title: 'Número registro', field: 'rg_numero_registro' },
    { title: 'Data de expedição', field: 'rg_data_espedicao', type: 'date' },
    { title: 'Emissor', field: 'rg_emissor' },
    { title: 'Nome do pai', field: 'rg_nome_pai' },
    { title: 'Nome da mãe', field: 'rg_nome_mae' },
  ];

  const localization: Localization = {
    pagination: {
      labelRowsSelect: 'linhas',
      labelDisplayedRows: '{from} - {to} de {count}',
      firstTooltip: 'Primeira página',
      previousTooltip: 'Página anterior',
      nextTooltip: 'Próxima página',
      lastTooltip: 'Última página',
    },
    toolbar: {
      nRowsSelected: '{0} linha(s) selecionada',
      searchPlaceholder: 'Pesquisar',
    },
    header: {
      actions: 'Ações',
    },
    body: {
      emptyDataSourceMessage: 'Nenhum registro para exibir',
      filterRow: {
        filterTooltip: 'Filter',
      },
    },
  };

  function remoteData(query: Query<Row>): Promise<QueryResult<Row>> {
    return new Promise((resolve, reject) => {
      const configAxios: AxiosRequestConfig = {
        url: 'responsaveis',
        params: {
          select: 'id,nome,parentesco,cpf_numero,rg_numero_registro,rg_data_espedicao,rg_emissor,rg_nome_pai,rg_nome_mae',
          limit: query.pageSize,
          page: query.page + 1,
        },
      };

      if (query.search) {
        configAxios.params.search = query.search;
      }

      if (query.orderBy) {
        configAxios.params.orderBy = query.orderBy.field;
        configAxios.params.orderDirection = query.orderDirection;
      }

      api(configAxios)
        .then((response) => {
          resolve({
            data: response.data,
            page: query.page,
            totalCount: Number(response.headers['x-total-count']),
          });
        })
        .catch((erro) => reject(erro));
    });
  }

  return (
    <MaterialTable
      tableRef={tableRef}
      title="Responsáveis"
      columns={columns}
      data={remoteData}
      options={{
        debounceInterval: 500,
      }}
      localization={localization}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => {
          setTimeout(() => {
            api.post('responsaveis', newData)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
        onRowUpdate: (newData) => new Promise((resolve) => {
          setTimeout(() => {
            api.put(`responsaveis/${newData.id}`, newData)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
        onRowDelete: (oldData) => new Promise((resolve) => {
          setTimeout(() => {
            api.delete(`responsaveis/${oldData.id}`)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
      }}
    />
  );
}
