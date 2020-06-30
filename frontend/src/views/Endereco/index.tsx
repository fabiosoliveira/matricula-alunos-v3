import React, { useRef } from 'react';
import MaterialTable, {
  Column, Query, QueryResult, Localization,
} from 'material-table';
import { AxiosRequestConfig } from 'axios';
import api from '../../service/api';

interface Row {
  id: string;
  rua: string;
  bairro: string;
  cep: string;
  cidade: string;
}

export default function TableEndereco() {
  const tableRef = useRef<any>();

  const columns: Column<Row>[] = [
    { title: 'Rua', field: 'rua' },
    { title: 'Bairro', field: 'bairro' },
    { title: 'Cep', field: 'cep' },
    { title: 'Cidade', field: 'cidade' },
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
        url: 'enderecos',
        params: {
          select: 'id,rua,bairro,cep,cidade',
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
      title="Endereços"
      columns={columns}
      data={remoteData}
      options={{
        debounceInterval: 500,
      }}
      localization={localization}
      editable={{
        onRowAdd: (newData) => new Promise((resolve) => {
          setTimeout(() => {
            api.post('enderecos', newData)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
        onRowUpdate: (newData) => new Promise((resolve) => {
          setTimeout(() => {
            api.put(`enderecos/${newData.id}`, newData)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
        onRowDelete: (oldData) => new Promise((resolve) => {
          setTimeout(() => {
            api.delete(`enderecos/${oldData.id}`)
              .then(() => resolve())
              .then(() => tableRef.current.onQueryChange());
          }, 600);
        }),
      }}
    />
  );
}
