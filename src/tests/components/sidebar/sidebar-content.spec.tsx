import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const initialPrompts = [
  {
    id: '1',
    title: 'Title 01',
    content: 'Content 01',
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
  describe('base', () => {
    it('should render a new prompt button', () => {
      makeSut();
      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo Prompt' })).toBeVisible();
    });

    it('deveria renderizar a lista de promps', () => {
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
        },
      ];
      makeSut({ prompts: input });

      expect(screen.getByText(input[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(input.length);
    });

    it('deveria atualizar o campo de busca ao digitar', async () => {
      const text = 'AI';
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await userEvent.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('collapse', () => {
    const user = userEvent.setup();

    it('should render collapse and render collapse button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });
      expect(expandButton).not.toBeInTheDocument();
    });

    it('should collapse sidebar when clicking collapse button', async () => {
      makeSut();
      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      await user.click(collapseButton);

      const expandButton = screen.getByRole('button', {
        name: /expandir sidebar/i,
      });
      expect(expandButton).toBeInTheDocument();

      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe('new prompt', () => {
    it('should navigate to /new when clicking new prompt button', async () => {
      makeSut();

      const newButton = screen.getByRole('button', { name: 'Novo Prompt' });

      await userEvent.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('busca', () => {
    const user = userEvent.setup();

    it.only('Deveria navegar com URL codificada ao digitar e limpar', async () => {
      const text = 'A B';
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=A%20B');

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/');
    });
  });
});
